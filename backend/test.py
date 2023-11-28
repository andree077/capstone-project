import whisper
import datetime
import subprocess
import torch
import pyannote.audio

#speaker vefification - pretrained model -->identifies speakers
from pyannote.audio.pipelines.speaker_verification import PretrainedSpeakerEmbedding
from pyannote.audio import Audio
from pyannote.core import Segment
import wave
from pathlib import Path
import contextlib
import os
import pandas as pd
from gensim.models import Word2Vec
import nltk
from nltk.tokenize import word_tokenize
import string
import librosa
import shutil
from sklearn.cluster import KMeans
from pydub import AudioSegment
#cluster
from sklearn.cluster import AgglomerativeClustering
import numpy as np
import nltk

import pathlib
from pathlib import WindowsPath

temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

model_path_str = "C:/Projects/capstone-project/backend/embedding_model.pth"
model_path = WindowsPath(os.path.normpath(model_path_str))

# Load the model and map it to the CPU
embedding_model = torch.load(model_path, map_location=torch.device('cpu'))

def diarize_call(call_rec):
  #initialise values
  num_speakers = 2
  language = 'English'
  print("Call recording : ", call_rec)

  model_size = 'medium'

  model_name = model_size
  if language == 'English' and model_size != 'large':
    model_name += '.en'

  #check if code isnt wav file
  if call_rec[-3:] != 'wav':
    subprocess.call(['ffmpeg', '-i', call_rec, 'audio.wav', '-y'])
    path = 'audio.wav'

  #loading the model
  model = whisper.load_model(model_size)

  result = model.transcribe(call_rec)
  segments = result["segments"]

  audio = AudioSegment.from_file(call_rec)

  # Get the raw audio data as an array of samples
  samples = audio.get_array_of_samples()
  frames = len(samples)

  # Get the sample rate (frame rate) of the audio
  rate = audio.frame_rate

  # Print the results
  print("Frames:", len(samples))
  print("Frame Rate:", rate)

  duration = frames/float(rate)

  audio = Audio()

  def segment_embedding(segment):
    start = segment["start"]

    # Whisper overshoots the end timestamp in the last segment
    end = min(duration, segment["end"])
    clip = Segment(start, end)
    waveform, sample_rate = audio.crop(path, clip)
    return embedding_model(waveform[None])

  embeddings = np.zeros(shape=(len(segments), 192))

  for i, segment in enumerate(segments):
    embeddings[i] = segment_embedding(segment)

  embeddings = np.nan_to_num(embeddings)

  clustering = AgglomerativeClustering(num_speakers).fit(embeddings)
  labels = clustering.labels_
  for i in range(len(segments)):
    segments[i]["speaker"] = 'SPEAKER ' + str(labels[i] + 1)
  print("In diarize")
  return segments


def extract_linguistic(sentence):
  model_path = "C:/Projects/capstone-project/backend/word2vec/wordtovector.model"
  model = Word2Vec.load(model_path)
  tokens = word_tokenize(sentence)
  vectors = [model.wv[word] for word in tokens if word in model.wv.key_to_index]
  print("in lingusitic")
  if vectors:
    return np.mean(vectors, axis=0)
  return np.zeros(model.vector_size)


def extract_acoustic(path,start,end):
  start = int(start*1000)
  end = int(end*1000)
  audio, sr = librosa.load(path, sr=None)
  audio_file = audio[start:end]
  # extract the features
  neutral_mfccs = librosa.feature.mfcc(y=audio_file, sr=sr, n_mfcc=30)
  neutral_chroma = librosa.feature.chroma_stft(y=audio_file, sr=sr, n_chroma=20)

  # concatenate the features into a single feature vector
  features = np.concatenate((neutral_mfccs.mean(axis=1), neutral_mfccs.var(axis=1), neutral_chroma.mean(axis=1), neutral_chroma.var(axis=1)))
  print("in acoustic")
  return features


def feature_extraction(segment, path):
  import numpy as np

  ling_features = extract_linguistic(segment['text'])

  acoustic_features = extract_acoustic(path, segment['start'], segment['end'])

  #Combining the features
  ling_features = np.array(ling_features)
  acoustic_features = np.array(acoustic_features)

  combined_features = np.concatenate((ling_features,acoustic_features))
  print("in feature ext")
  return combined_features


def load_model():
  from tensorflow.keras.models import load_model
  import tensorflow as tf

  comms_round = 10
  model_path = "C:/Projects/capstone-project/backend/new_globalmodel.h5"
  loss='categorical_crossentropy'
  metrics = ['accuracy',tf.keras.metrics.Recall(),tf.keras.metrics.Precision() ]
  optimizer = tf.keras.optimizers.legacy.RMSprop(learning_rate=0.00001, decay=1e-6)

  model = load_model(model_path)

  model.compile(loss=loss,
                optimizer=optimizer,
                metrics=metrics)
  print("in load model")
  return model

def predict_emotion(features,model):
  import numpy as np
  class_labels = ['Neutral','Angry','Happy','Confused']
  features = np.expand_dims(features, axis=0)
  # Predict the output for the single input
  logits = model.predict(features)

  # Assuming the model has softmax activation for multiclass classification, you can convert logits to probabilities
  probabilities = tf.nn.softmax(logits)

  # Find the index of the class with the highest probability
  predicted_class_index = np.argmax(probabilities)

  # Get the corresponding class label
  predicted_class_label = class_labels[predicted_class_index]

  # Return the predicted probabilities
  print("in prediction")
  return predicted_class_label

input_directory = 'C:/Projects/capstone-project/backend/uploads/'

call_data = []

for filename in os.listdir(input_directory):
  each_call_data = []

  audio_path = os.path.join(input_directory, filename)

  if os.path.exists(audio_path):
    call_dict = diarize_call(audio_path)
  else:
    print(f"File not found: {audio_path}")

  for segment in call_dict:
      #extract features
    features = feature_extraction(segment, call_rec)
    model = load_model()
    emotion = predict_emotion(features,model)
    segment['emotion'] = emotion

  each_call_data.append(call_dict)
  call_data.append(each_call_data)

print(call_data)