import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase.from("dashboard_data").select("*");
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { category, value, type } = await request.json();
    const { data, error } = await supabase
      .from("dashboard_data")
      .insert({ category, value: parseFloat(value), type })
      .select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
