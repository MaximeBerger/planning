import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://connecteur.alcuin.com/ADS/ESTP.mvc/api/ics/f45c55f7-927b-48b1-8093-8da48186ba4d',
      {
        headers: {
          'Accept': 'text/calendar',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du calendrier');
    }

    const data = await response.text();
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/calendar',
      },
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du calendrier' },
      { status: 500 }
    );
  }
} 