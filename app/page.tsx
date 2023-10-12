"use client"

import Navbar from "@/components/Navbar";
import Feed from "@/components/feed/Feed";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar></Navbar>
            <Feed/>
        </div>
    );
}