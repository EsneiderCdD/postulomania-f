"use client";

type Props = {
  label: string;
};

export default function RunButton({ label }: Props) {
  return (
    <button className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm text-neutral-300">
      {label}
    </button>
  );
}
