import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string' || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: 'No file provided in request' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Only JPG, PNG, and WebP are supported' },
        { status: 400 }
      );
    }

    // Max 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum 5MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, (file as File).name || 'upload.jpg', file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      provider: result.provider,
    });
  } catch (error: any) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Image upload failed', details: error.message },
      { status: 500 }
    );
  }
}
