import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerifyEntryPage from '@/app/verify/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock html5-qrcode
const mockScanFile = jest.fn();
jest.mock('html5-qrcode', () => {
  return {
    Html5QrcodeScanner: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
      clear: jest.fn().mockResolvedValue(undefined),
    })),
    Html5Qrcode: jest.fn().mockImplementation(() => ({
      scanFile: mockScanFile,
    })),
  };
});

describe('VerifyEntryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tabs and manual input', () => {
    render(<VerifyEntryPage />);
    
    expect(screen.getByText('Live Camera')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 0xd484677...')).toBeInTheDocument();
  });

  it('switches between camera and upload views', () => {
    render(<VerifyEntryPage />);
    
    // Initially camera should be active (we can test active state by looking for specific text or just clicking)
    const uploadBtn = screen.getByText('Upload Image');
    fireEvent.click(uploadBtn);
    
    // After clicking, the upload prompt should be visible
    expect(screen.getByText('Click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supports JPG, PNG, WEBP')).toBeInTheDocument();
  });

  it('handles image upload correctly', async () => {
    mockScanFile.mockResolvedValueOnce('0x123abc');
    
    render(<VerifyEntryPage />);
    
    // Switch to upload tab
    fireEvent.click(screen.getByText('Upload Image'));
    
    // Simulate file upload
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockScanFile).toHaveBeenCalledWith(file, true);
    });
  });
});
