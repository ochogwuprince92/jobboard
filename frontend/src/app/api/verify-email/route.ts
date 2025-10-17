import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { message: 'Token is required' },
      { status: 400 }
    );
  }

  try {
    // Provide a default API URL if not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const verifyUrl = `${apiUrl}/api/verify-email/?token=${encodeURIComponent(token)}`;
    
    console.log('Using API URL:', apiUrl);
    console.log('Verification URL:', verifyUrl);
    
    // Validate the URL is properly formed
    try {
      new URL(verifyUrl);
    } catch (urlError) {
      console.error('Invalid API URL:', verifyUrl, urlError);
      return NextResponse.json(
        { 
          message: 'Server configuration error: Invalid API URL',
          details: `The API URL '${apiUrl}' is not a valid URL`
        },
        { status: 500 }
      );
    }

    let response;
    let responseText;
    let data;
    
    try {
      response = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      // Get the response as text first
      responseText = await response.text();
      
      // Try to parse as JSON
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error('Failed to parse JSON response. Response was:', responseText);
        return NextResponse.json(
          { 
            message: 'Invalid JSON response from server',
            details: responseText.startsWith('<') ? 'Received HTML response instead of JSON' : 'Invalid JSON format'
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Network error:', error);
      return NextResponse.json(
        { 
          message: 'Failed to connect to the server',
          details: error instanceof Error ? error.message : 'Unknown network error'
        },
        { status: 502 } // Bad Gateway
      );
    }

    console.log('Verification response:', {
      status: response.status,
      statusText: response.statusText,
      data
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.message || `Verification failed with status ${response.status}`,
          details: data.details
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { 
        message: 'An error occurred during verification',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
