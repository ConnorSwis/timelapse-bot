import os
import sys
import cv2
import glob
import argparse
import subprocess


platform = sys.platform
if platform == 'linux' or platform == 'linux2':config = {"dir": "/home/pi/share/timelapse/","temp_dir": "/temp/"}
else:config = {"dir": "T:\\timelapse\\","temp_dir": "C:\\temp\\"}

def generate_video(config):
    images = sorted(glob.glob(config.dir+"*.jpg"))
    frame = cv2.imread(images[0])
    height, width, _ = frame.shape  
    
    temp_path = os.path.join(config.temp_dir, config.output + ".avi")

    video = cv2.VideoWriter(temp_path, 0, config.framerate, (width, height)) 
    for image in images:
        video.write(cv2.imread(image))
    video.release()  
    
    subprocess.run(
        ['ffmpeg', '-i', temp_path, '-acodec', 'mp2', '-y', config.output + ".mp4"],
        stdout=subprocess.DEVNULL,  # supress output
        stderr=subprocess.STDOUT
    )
    os.remove(temp_path)
    
    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Create mp4 from jpg's.")
    parser.add_argument(
        'output',
        default="timelapse",
        nargs='?',
        help="Name of output file w/o extention (.mp4 only)"
    )
    parser.add_argument(
        '-f', '--framerate',
        required=False,
        default=60,
        type=int,
        help="Frames per second."
    )
    args = parser.parse_args()
    [args.__setattr__(k, config[k]) for k in config.keys()]
    

    generate_video(args)
