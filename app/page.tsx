"use client"

import Navbar from "@/components/Navbar";
import Feed from "@/components/feed/Feed";

export default function Home() {
    return (
        <div>
            <Navbar></Navbar>
            <Feed/>
        </div>
    );
}