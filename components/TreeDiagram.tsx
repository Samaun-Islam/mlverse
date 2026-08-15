"use client";

import { motion } from "framer-motion";
import type { TreeNode } from "@/lib/decisionTree";

const CLASS_COLORS = ["#818cf8", "#fb923c"];
const CLASS_NAMES = ["Class 0", "Class 1"];

export default function TreeDiagram({ tree }: { tree: TreeNode }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex justify-center min-w-fit px-4">
        <TreeNodeBox node={tree} />
      </div>
    </div>
  );
}

function TreeNodeBox({ node }: { node: TreeNode }) {
  const isLeaf = node.feature === undefined || !node.left || !node.right;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border px-3.5 py-2.5 text-center min-w-[130px] ${
          isLeaf
            ? "border-2"
            : "bg-gray-800/80 border-gray-700"
        }`}
        style={
          isLeaf
            ? {
                borderColor: CLASS_COLORS[node.prediction],
                backgroundColor: `${CLASS_COLORS[node.prediction]}15`,
              }
            : undefined
        }
      >
        {isLeaf ? (
          <>
            <p
              className="text-xs font-semibold"
              style={{ color: CLASS_COLORS[node.prediction] }}
            >
              {CLASS_NAMES[node.prediction]}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {node.samples} samples
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-mono font-semibold text-gray-200">
              {node.feature} ≤ {node.threshold?.toFixed(2)}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              gini {node.gini.toFixed(2)} · {node.samples} samples
            </p>
          </>
        )}
      </motion.div>

      {!isLeaf && (
        <>
          {/* সংযোগকারী লাইন */}
          <div className="w-px h-4 bg-gray-700" />
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 mb-1">Yes</span>
              <TreeNodeBox node={node.left!} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 mb-1">No</span>
              <TreeNodeBox node={node.right!} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}