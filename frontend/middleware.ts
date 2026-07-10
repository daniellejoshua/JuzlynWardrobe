import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


const protectedRutes = ["/wardrobe", "/models", "/upload", "/outfits", "/gallery"];

export async function middleware(request:NextRequest){
    const response = NextResponse.next()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(c => response.cookies.set(c.name,c.value,c.options))
    },
  },
});


const {data:{user}} = await supabase.auth.getUser()

if(!user && protectedRutes.includes(request.nextUrl.pathname)){
    return NextResponse.redirect(new URL("/login",request.url))
}

if(user && request.nextUrl.pathname === ("/login")){
    return NextResponse.redirect(new URL("/wardrobe",request.url))
}

return response;

}
export const config = {
  matcher: ["/wardrobe/:path*", "/models/:path*", "/upload/:path*", "/login", "/outfits","/gallery"],
};