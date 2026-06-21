import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://ar.pinterest.com/EzequielTorresart/feed.rss', { next: { revalidate: 60 } });
    const text = await response.text();
    // Extraer imágenes y usar la versión de alta resolución (736x en vez de 236x)
    const images = [...text.matchAll(/src=&quot;([^&]+)&quot;/g)]
      .map(m => m[1].replace('236x', '736x'));
      
    // Eliminar duplicados si los hay y devolver los 15 más recientes
    const uniqueImages = Array.from(new Set(images)).slice(0, 30);
    
    return NextResponse.json({ images: uniqueImages });
  } catch (error) {
    return NextResponse.json({ images: [] });
  }
}
