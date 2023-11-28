import whisper
import sys
import os
import datetime
import subprocess
import torch
import pyannote.audio
from pyannote.audio import Audio
from pyannote.core import Segment
import wave
import contextlib
from sklearn.cluster import AgglomerativeClustering
import numpy as np
from pyannote.audio.pipelines.speaker_verification import PretrainedSpeakerEmbedding

import pathlib
from pathlib import WindowsPath

temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

model_path_str = "C:/Projects/capstone-project/backend/embedding_model.pth"
model_path = WindowsPath(os.path.normpath(model_path_str))

embedding_model = torch.load(model_path, map_location=torch.device('cpu'))

def convert_audio(input_path, output_path):
    # Use SoX to convert the audio file to the desired format
    subprocess.call(['sox', input_path, '-b', '16', '-e', 'signed-integer', output_path])


def diarize(audio_file_path):
    #whisper_base_path = "/Users/arshan/whisper.cpp-master"
    num_speakers = 2

    language = 'English'

    model_size = 'medium'


    model_name = model_size
    if language == 'English' and model_size != 'large':
        model_name += '.en'
    
    # Use the provided audio file path
    path = audio_file_path

    if path[-3:] != 'wav':
        # Define the output file path for the converted audio
        converted_audio_path = 'audio.wav'

        # Use SoX to convert the input audio file to the desired format
        convert_audio(path, converted_audio_path)

        path = converted_audio_path
        subprocess.call(['ffmpeg', '-i', path, 'audio.wav', '-y'])
        path = 'audio.wav'

    #speaker vefification - pretrained model -->  identifies speakers

    model = whisper.load_model(model_size)

    result = model.transcribe(path)
    segments = result["segments"]

    with contextlib.closing(wave.open(path,'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)

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
    
    def time(secs):
        return datetime.timedelta(seconds=round(secs))

    for (i, segment) in enumerate(segments):
        name = segment["speaker"]+'.txt'
        f = open(name, "a")
        if i == 0 or segments[i - 1]["speaker"] != segment["speaker"]:
            f.write("\n" + segment["speaker"] + ' ' + str(time(segment["start"])) + '\n')
        f.write(segment["text"][1:] + ' ')
        f.close()



audio_file_path = sys.argv[1]  
diarize(audio_file_path)