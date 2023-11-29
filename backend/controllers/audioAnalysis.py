import whisper
import os
import contextlib
import wave
import numpy as np
import librosa
import joblib
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize
import tensorflow as tf
from sklearn.cluster import AgglomerativeClustering
from pyannote.audio import Audio
from pyannote.core import Segment

# Paths
ser_model_path = "D:/Projects/capstone-project/backend/new_globalmodel.h5"
word2vec_model_path = "D:/Projects/capstone-project/backend/word2vec/wordtovector.model"
input_directory = 'D:/Projects/capstone-project/backend/uploads/'

# Load SER model
def load_ser_model(model_path):
    return tf.keras.models.load_model(model_path)

# Load Word2Vec model
def load_word2vec_model(model_path):
    return Word2Vec.load(model_path)

# Diarization using Whisper
def diarize_call(audio_file_path):
    model_size = 'medium'
    model = whisper.load_model(model_size)

    result = model.transcribe(audio_file_path)
    segments = result["segments"]

    with contextlib.closing(wave.open(audio_file_path, 'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)

    audio = Audio()
    embeddings = []

    for segment in segments:
        start, end = segment["start"], min(segment["end"], duration)
        waveform, sample_rate = audio.crop(audio_file_path, Segment(start, end))
        embeddings.append(waveform[None])  # Modify according to your embedding model

    embeddings = np.nan_to_num(embeddings)
    clustering = AgglomerativeClustering(n_clusters=2).fit(embeddings)
    labels = clustering.labels_

    for i, segment in enumerate(segments):
        segments[i]["speaker"] = 'SPEAKER ' + str(labels[i] + 1)

    return segments

# Extract linguistic features
def extract_linguistic_features(sentence, word2vec_model):
    tokens = word_tokenize(sentence)
    vectors = [word2vec_model.wv[word] for word in tokens if word in word2vec_model.wv.key_to_index]
    return np.mean(vectors, axis=0) if vectors else np.zeros(word2vec_model.vector_size)

# Extract acoustic features
def extract_acoustic_features(audio_file_path, start, end):
    y, sr = librosa.load(audio_file_path, sr=None, offset=start, duration=end - start)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=30)
    chroma = librosa.feature.chroma_stft(y=y, sr=sr, n_chroma=20)
    return np.concatenate([mfccs.mean(axis=1), chroma.mean(axis=1)])

# Predict emotion
def predict_emotion(features, model):
    return model.predict(np.array([features]))[0]

# Process each file in the directory
def process_directory(directory_path, ser_model, word2vec_model):
    call_data = []

    for filename in os.listdir(directory_path):
        each_call_data = []
        file_path = os.path.join(directory_path, filename)
        segments = diarize_call(file_path)

        for segment in segments:
            ling_features = extract_linguistic_features(segment['text'], word2vec_model)
            acoustic_features = extract_acoustic_features(file_path, segment['start'], segment['end'])
            combined_features = np.concatenate((ling_features, acoustic_features))
            emotion = predict_emotion(combined_features, ser_model)
            segment['emotion'] = emotion
        each_call_data.append(segments)
        call_data.append(each_call_data)

    return call_data

# Main execution
if __name__ == '__main__':
    ser_model = load_ser_model(ser_model_path)
    word2vec_model = load_word2vec_model(word2vec_model_path)
    results = process_directory(input_directory, ser_model, word2vec_model)
    print(results)
