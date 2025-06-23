import React from 'react';
import SimpleVideoPlayer from '../SimpleVideoPlayer';
import videoData from '../../data/videos.json';

const VideoSection: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why are we better?</h2>
          <p className="text-lg text-gray-300">See our innovative features in action with this demonstration</p>
        </div>
        <SimpleVideoPlayer videos={videoData} />
      </div>
    </div>
  );
};

export default VideoSection;