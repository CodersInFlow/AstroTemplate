import React, { useState, useEffect } from 'react';

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  maxLength?: number;
  supportsImage: boolean;
}

const platforms: Platform[] = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
    color: 'text-orange-500',
    supportsImage: false
  },
  {
    id: 'devto',
    name: 'Dev.to',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.53.58.28.88.94.88 1.9 0 2.28-.31 3.18-1.03 3.92zm5.09-5.47h-2.47v1.77h1.52v1.28h-1.52v1.55h2.47v1.28H10.1v-7.16h3.55v1.28zm4.81 0h-2.47v1.77h1.52v1.28h-1.52v1.55h2.47v1.28h-3.54v-7.16h3.54v1.28z"/>
      </svg>
    ),
    color: 'text-white',
    supportsImage: true
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    color: 'text-blue-500',
    maxLength: 3000,
    supportsImage: true
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'text-blue-600',
    supportsImage: true
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'text-gray-400',
    maxLength: 280,
    supportsImage: true
  }
];

interface PublishStatus {
  platform: string;
  status: 'pending' | 'publishing' | 'success' | 'error';
  url?: string;
  message?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  postDescription: string;
  postSlug: string;
  coverImage?: string;
}

export default function SocialPublishModal({ 
  isOpen: initialIsOpen, 
  onClose: propsOnClose, 
  postId, 
  postTitle, 
  postDescription,
  postSlug,
  coverImage 
}: Props) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<PublishStatus[]>([]);
  const [subreddit, setSubreddit] = useState('webdev');
  
  const onClose = () => {
    setIsOpen(false);
    setSelectedPlatforms([]);
    setPublishStatus([]);
    setPublishing(false);
    if (propsOnClose) propsOnClose();
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openSocialPublishModal', handleOpen);
    return () => window.removeEventListener('openSocialPublishModal', handleOpen);
  }, []);

  useEffect(() => {
    // Initialize custom messages with defaults
    const defaultMessages: Record<string, string> = {
      reddit: postTitle,
      devto: postTitle,
      linkedin: `Check out my latest article: ${postTitle}\n\n${postDescription}`,
      facebook: postDescription,
      twitter: `${postTitle} ${window.location.origin}/blog/${postSlug}`
    };
    setCustomMessages(defaultMessages);
  }, [postTitle, postDescription, postSlug]);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;

    setPublishing(true);
    setPublishStatus(
      selectedPlatforms.map(p => ({ platform: p, status: 'pending' }))
    );

    // Create EventSource for real-time updates
    const eventSource = new EventSource(
      `${import.meta.env.PUBLIC_API_URL || 'http://localhost:8749'}/api/social/publish-stream`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPublishStatus(prev =>
        prev.map(s =>
          s.platform === data.platform
            ? { ...s, status: data.status, url: data.url, message: data.message }
            : s
        )
      );
    };

    // Send publish request
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_URL || 'http://localhost:8749'}/api/social/publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          postId,
          platforms: selectedPlatforms.map(p => ({
            platform: p,
            message: customMessages[p],
            subreddit: p === 'reddit' ? subreddit : undefined,
            useImage: platforms.find(plt => plt.id === p)?.supportsImage && coverImage
          }))
        })
      }
    );

    if (!response.ok) {
      console.error('Failed to publish');
    }

    eventSource.close();
    setPublishing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Publish to Social Media</h2>
          <p className="text-gray-400 text-sm mt-1">Share your post across multiple platforms</p>
        </div>

        <div className="p-6">
          {/* Platform Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                disabled={publishing}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                } ${publishing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`${platform.color} mb-2`}>{platform.icon}</div>
                <div className="text-white font-medium">{platform.name}</div>
                {platform.maxLength && (
                  <div className="text-xs text-gray-500 mt-1">
                    Max {platform.maxLength} chars
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Messages */}
          {selectedPlatforms.length > 0 && !publishing && (
            <div className="space-y-4 mb-6">
              <h3 className="text-white font-medium">Customize Messages</h3>
              {selectedPlatforms.map(platformId => {
                const platform = platforms.find(p => p.id === platformId)!;
                return (
                  <div key={platformId} className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <span className={platform.color}>{platform.icon}</span>
                      {platform.name}
                      {platformId === 'reddit' && (
                        <input
                          type="text"
                          value={subreddit}
                          onChange={(e) => setSubreddit(e.target.value)}
                          placeholder="subreddit"
                          className="ml-2 px-2 py-1 bg-gray-700 rounded text-sm"
                        />
                      )}
                    </label>
                    <textarea
                      value={customMessages[platformId] || ''}
                      onChange={(e) =>
                        setCustomMessages(prev => ({
                          ...prev,
                          [platformId]: e.target.value
                        }))
                      }
                      maxLength={platform.maxLength}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {platform.maxLength && (
                      <div className="text-xs text-gray-500 text-right">
                        {customMessages[platformId]?.length || 0} / {platform.maxLength}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Publishing Status */}
          {publishing && (
            <div className="space-y-3 mb-6">
              <h3 className="text-white font-medium">Publishing Progress</h3>
              {publishStatus.map(status => {
                const platform = platforms.find(p => p.id === status.platform)!;
                return (
                  <div key={status.platform} className="flex items-center gap-3 p-3 bg-gray-900 rounded">
                    <span className={platform.color}>{platform.icon}</span>
                    <span className="text-white flex-1">{platform.name}</span>
                    {status.status === 'pending' && (
                      <span className="text-gray-400">Waiting...</span>
                    )}
                    {status.status === 'publishing' && (
                      <span className="text-yellow-400">Publishing...</span>
                    )}
                    {status.status === 'success' && (
                      <>
                        <span className="text-green-400">✓ Published</span>
                        {status.url && (
                          <a
                            href={status.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm"
                          >
                            View →
                          </a>
                        )}
                      </>
                    )}
                    {status.status === 'error' && (
                      <span className="text-red-400">✗ {status.message || 'Failed'}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
          {!publishing && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={selectedPlatforms.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </button>
            </>
          )}
          {publishing && publishStatus.every(s => s.status === 'success' || s.status === 'error') && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}