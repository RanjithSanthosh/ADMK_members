// app/api/submit/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the data from the form
    const data = await request.json();

    // Get the Google Script URL from environment variables
    const googleSheetWebAppUrl = process.env.GOOGLE_SHEET_WEB_APP_URL;

    if (!googleSheetWebAppUrl) {
      throw new Error('Google Sheet Web App URL is not defined');
    }

    // Send the data to the Google Apps Script
    // We use 'no-cors' mode here because Google Scripts often have CORS issues
    // and we are just "firing and forgetting" the data.
    // The Apps Script 'doPost' will handle the redirect.
    const response = await fetch(googleSheetWebAppUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Google Apps Script, when successful, often returns a redirect.
    // We'll treat a successful (even if redirect) response as 'ok'.
    if (response.ok || response.type === 'opaque' || response.status === 200 || response.status === 302) {
      // The Apps Script will handle appending the row.
      // We just need to confirm we sent it.
      return NextResponse.json({ result: 'success' });
    } else {
      // Handle the case where the fetch itself failed
      const errorText = await response.text();
      return NextResponse.json({ result: 'error', error: `Google Script fetch failed: ${errorText}` }, { status: 500 });
    }

  } catch (error: any) {
    // Handle errors in our API route
    return NextResponse.json({ result: 'error', error: error.message }, { status: 500 });
  }
}