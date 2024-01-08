"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';
import './globals.css';
import cursorUrl from './custom-cursor.svg';

export default function HomePage() {
  const [typedText, setTypedText] = useState('');
  const targetText = 'We utilize ChatGPT to construct a knowledge base based on personal pdfs. 🤖';
  const cursorAnimationDuration = 1.5; // 光标闪烁动画的持续时间（秒）
  const delayBeforeRestart = 30000; // 循环开始前的等待时间（毫秒）

  useEffect(() => {
    let currentIndex = 0;
    let typewriterTimeout;
    let restartTimeout;

    const startTypewriter = () => {
      typewriterTimeout = setTimeout(() => {
        if (currentIndex <= targetText.length) {
          setTypedText(targetText.substring(0, currentIndex));
          currentIndex++;
          startTypewriter();
        } else {
          restartTimeout = setTimeout(() => {
            setTypedText('');
            currentIndex = 0;
            startTypewriter();
          }, delayBeforeRestart);
        }
      }, 100); // 调整打字速度，单位为毫秒
    };

    startTypewriter();

    return () => {
      clearTimeout(typewriterTimeout);
      clearTimeout(restartTimeout);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-16 px-8">
        <nav className="flex justify-between items-center mb-8">
          <div>
            <Link href="/auth/signin" className="text-white text-lg mr-4">
              Login
            </Link>
            <Link href="/auth/signup" className="text-white text-lg mr-4">
              Register
            </Link>
            <Link href="/about" className="text-white text-lg">
              About
            </Link>
          </div>
        </nav>
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Private Domain Database 💭</h1>
          <h3 className="text-4xl font-bold">
            <span>{typedText}</span>
            <span className="cursor-animation" style={{ animationDuration: `${cursorAnimationDuration}s` }} />
          </h3>
        </div>
      </div>
      <style jsx>{`
        .cursor-animation {
          display: inline-block;
          vertical-align: bottom;
          animation: cursor-blink ${cursorAnimationDuration}s infinite;
          background-image: url('${cursorUrl}');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          width: 2rem;
          height: 3rem;
        }

        @keyframes cursor-blink {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}