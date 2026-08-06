import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Is my uploaded image sent to any external server?',
    answer:
      'No, absolutely not. All image processing, canvas downscaling, quality compression, and format conversions execute 100% inside your browser using Web Workers and OffscreenCanvas. Your private photos never touch a cloud server.',
  },
  {
    question: 'How do I compress an image to stay under a specific file size limit (e.g. 200 KB)?',
    answer:
      'In the control panel, click the "Compression" tab, toggle "Compress to Max File Size", and enter your desired limit (e.g. 200 KB). Our Web Worker automatically calculates the exact quality percentage needed to stay under that threshold.',
  },
  {
    question: 'Can I resize multiple images at once in bulk?',
    answer:
      'Yes! You can drag and drop multiple images simultaneously or paste images directly from your clipboard (Cmd+V / Ctrl+V). Our multi-threaded engine resizes and compresses your entire queue in parallel.',
  },
  {
    question: 'Which social media presets are available?',
    answer:
      'We provide one-click presets for Instagram Posts (1080x1080), Instagram Stories (1080x1920), YouTube Thumbnails (1280x720), Twitter Headers (1500x500), LinkedIn Banners (1584x396), and Facebook Covers (820x312).',
  },
  {
    question: 'Which image file formats are supported?',
    answer:
      'You can upload JPG, JPEG, PNG, WEBP, GIF, and AVIF files. You can export to JPG, PNG, WEBP, or AVIF format with custom compression presets.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Everything you need to know about ImageResizer
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Fast, private, in-browser image optimization powered by modern Web APIs.
        </p>
      </div>

      {/* Accordions */}
      <div className="w-full max-w-3xl flex flex-col gap-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-zinc-900 dark:text-zinc-100' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full pt-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">100% In-Browser Privacy</span>
            <span className="text-[11px] text-zinc-500">Zero files uploaded to any server</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Web Worker Engine</span>
            <span className="text-[11px] text-zinc-500">Multi-threaded off-main-thread processing</span>
          </div>
        </div>
      </div>
    </section>
  );
};
