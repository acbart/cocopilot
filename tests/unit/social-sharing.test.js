/**
 * Unit tests for social sharing functionality
 */

describe('Social Sharing', () => {
  beforeEach(() => {
    // Mock window APIs
    global.window.open = jest.fn();
    // Use the JSDOM window location which defaults to http://localhost/
    delete window.location;
    window.location = { href: 'http://localhost:8000' };

    // Mock clipboard API
    global.navigator.clipboard = {
      writeText: jest.fn()
    };

    global.document.execCommand = jest.fn();
    global.alert = jest.fn();
  });

  describe('shareOnTwitter', () => {
    const shareOnTwitter = () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Check out CocoPilot - a self-updating repository that evolves through AI! 🤖✨');
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    };

    test('should open Twitter share URL', () => {
      shareOnTwitter();

      expect(window.open).toHaveBeenCalledWith(
        'https://twitter.com/intent/tweet?url=http%3A%2F%2Flocalhost%3A8000&text=Check%20out%20CocoPilot%20-%20a%20self-updating%20repository%20that%20evolves%20through%20AI!%20%F0%9F%A4%96%E2%9C%A8',
        '_blank'
      );
    });
  });

  describe('shareOnLinkedIn', () => {
    const shareOnLinkedIn = () => {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    test('should open LinkedIn share URL', () => {
      shareOnLinkedIn();

      expect(window.open).toHaveBeenCalledWith(
        'https://www.linkedin.com/sharing/share-offsite/?url=http%3A%2F%2Flocalhost%3A8000',
        '_blank'
      );
    });
  });

  describe('copyLink', () => {
    beforeEach(() => {
      // Setup a mock button
      document.body.innerHTML = '<button class="share-btn"><span>🔗</span><span>Copy Link</span></button>';
    });

    const copyLink = async() => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const btn = document.querySelector('.share-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✅</span><span>Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      }
    };

    test('should copy link using clipboard API', async() => {
      navigator.clipboard.writeText.mockResolvedValueOnce();

      await copyLink();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:8000');
      expect(document.querySelector('.share-btn').innerHTML).toBe('<span>✅</span><span>Copied!</span>');
    });

    test('should fallback to document.execCommand when clipboard API fails', async() => {
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard not available'));

      await copyLink();

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(alert).toHaveBeenCalledWith('Link copied to clipboard!');
    });
  });
});