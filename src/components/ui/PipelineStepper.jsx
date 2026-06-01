import React from "react";
import { FiCheck } from "react-icons/fi";

const STAGES = ["New Lead", "Contacted", "Proposal", "Negotiation", "Won"];

export default function PipelineStepper({ currentStage, onChange }) {
  const currentIdx = STAGES.indexOf(currentStage);

  return (
    <div className="w-full bg-[#FAFAFA] border border-[#E8E2DD] p-4 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A817A]">
          Customer CRM Pipeline Stage
        </span>
        <span className="text-xs font-bold text-[#79553D] bg-[#F5ECE5] px-2 py-0.5 rounded">
          {currentStage}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-1.5 w-full">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;
          
          return (
            <React.Fragment key={stage}>
              {/* Step Pill */}
              <button
                type="button"
                onClick={() => onChange && onChange(stage)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 w-full md:w-auto flex-1 ${
                  isActive
                    ? "bg-[#79553D] text-white border-[#79553D] shadow-xs"
                    : isCompleted
                    ? "bg-[#FAF6F3] text-[#79553D] border-[#E8E2DD] hover:bg-[#F5ECE5]"
                    : "bg-white text-[#8A817A] border-[#E8E2DD] hover:text-[#2B2420] hover:bg-[#F9FAFB]"
                }`}
              >
                {isCompleted ? (
                  <FiCheck className="text-sm stroke-[3]" />
                ) : (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${
                    isActive ? "border-white/50 text-white" : "border-[#E8E2DD] text-[#8A817A]"
                  }`}>
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{stage}</span>
              </button>

              {/* Connecting Line (for MD layout) */}
              {idx < STAGES.length - 1 && (
                <div className="hidden md:block w-4 h-px bg-[#E8E2DD]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
