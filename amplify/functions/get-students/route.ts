import { NextResponse } from 'next/server';
import outputs from '@/amplify_outputs.json';

export async function GET() {
  const res = await fetch(`${outputs.custom.API.myRestApi.endpoint}/items`);
  const data = await res.json();
  return NextResponse.json(data);
}
