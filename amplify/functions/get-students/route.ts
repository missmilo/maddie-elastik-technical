import { NextResponse } from 'next/server';
import { myRestApi } from '../../backend';

export async function GET() {
  const res = await fetch(`${myRestApi.url}/items`);
  const data = await res.json();
  return NextResponse.json(data);
}
