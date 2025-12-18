'use client';

import {
  Upload,
  PlayCircle,
  Music,
  Scissors,
  BarChart3,
  Download,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload Audio',
      description:
        'Drag & drop support for all major formats. Instant waveform generation for precise editing.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20'
    },
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: 'Speed Control',
      description:
        'Adjust playback speed from 0.5x to 3x with pitch correction. Real-time preview.',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      borderColor: 'border-indigo-400/20'
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Audio Effects',
      description:
        'Apply echo, reverb, fade, and custom filters. Layer multiple effects for professional results.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20'
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: 'Trim & Cut',
      description:
        'Precision trimming with visual waveform. Multiple selection points for complex edits.',
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
      borderColor: 'border-pink-400/20'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Listener Analytics',
      description:
        'Heatmap visualization showing most replayed sections. Track audience engagement.',
      color: 'text-rose-400',
      bgColor: 'bg-rose-400/10',
      borderColor: 'border-rose-400/20'
    }
  ];

  const featureDetails = [
    {
      title: 'Smart Audio Upload',
      description:
        'Upload any audio file and get instant visual feedback. Our system automatically generates a waveform for precise editing.',
      image: '📁',
      stats: ['Supports 15+ formats', 'Up to 500MB files', 'Instant processing']
    },
    {
      title: 'Professional Effects',
      description:
        'Apply studio-quality effects with simple controls. Create unique audio signatures.',
      image: '🎚️',
      stats: ['10+ built-in effects', 'Custom presets', 'Layer multiple effects']
    },
    {
      title: 'Intelligent Trimming',
      description:
        'Cut, split, and merge audio with pixel-perfect precision using our visual waveform editor.',
      image: '✂️',
      stats: ['0.1s precision', 'Multi-track editing', 'Undo/Redo history']
    },
    {
      title: 'Listener Insights',
      description:
        'Understand what resonates with your audience. See exactly which parts get repeated.',
      image: '📊',
      stats: ['Heatmap visualization', 'Play count analytics', 'Export insights']
    },
    {
      title: 'Export & Share',
      description:
        'Export in your preferred format and quality. Share directly to your favorite platforms.',
      image: '🚀',
      stats: ['MP3, WAV, FLAC', 'Custom quality', 'Direct sharing']
    }
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-24 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-24 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Edit smarter,
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              not harder
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Professional tools designed for creators who value both quality and insight
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Feature list */}
          <div className="lg:w-2/5 space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`relative w-full p-5 rounded-2xl text-left transition-all duration-300 group
                  ${
                    activeFeature === index
                      ? `${feature.bgColor} ${feature.borderColor} border scale-[1.02] shadow-xl shadow-blue-500/10`
                      : 'bg-gray-900/40 border border-gray-800 hover:bg-gray-900/60 hover:border-gray-700'
                  }
                `}
              >
                {activeFeature === index && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1 rounded-full bg-gradient-to-b from-blue-400 to-purple-400" />
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} backdrop-blur-md shadow-inner`}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>

                  {activeFeature === index && (
                    <Sparkles className={`w-4 h-4 ${feature.color}`} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Active panel */}
          <div className="lg:w-3/5">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-10 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${features[activeFeature].bgColor}`}>
                  <span className={`text-2xl ${features[activeFeature].color}`}>
                    {featureDetails[activeFeature].image}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {featureDetails[activeFeature].title}
                  </h3>
                  <p className="text-gray-400">
                    Feature {activeFeature + 1} of {features.length}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-lg mb-10">
                {featureDetails[activeFeature].description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {featureDetails[activeFeature].stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`${features[activeFeature].bgColor} ${features[activeFeature].borderColor}
                    border rounded-xl p-4 backdrop-blur-md hover:scale-[1.03] transition-transform`}
                  >
                    <p className={`text-sm font-medium ${features[activeFeature].color}`}>
                      {stat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
