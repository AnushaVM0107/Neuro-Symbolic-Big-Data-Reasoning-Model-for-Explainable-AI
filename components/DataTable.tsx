
import React, { useState } from 'react';
import type { TableData } from '../types';

const ROWS_PER_PAGE = 8;

export const DataTable: React.FC<{ data: TableData }> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { headers, rows } = data;

  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const selectedRows = rows.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  if (!headers || !rows) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium">
        <p>No tabular data available to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm p-2 rounded-[2.5rem]">
      <div className="bg-white rounded-[2.2rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} scope="col" className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {selectedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-indigo-50/30 transition-colors duration-200 group">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-8 py-5 whitespace-nowrap text-sm text-slate-600 font-semibold group-hover:text-indigo-700 transition-colors">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Showing <span className="text-slate-800">{startIndex + 1}</span> - <span className="text-slate-800">{Math.min(startIndex + ROWS_PER_PAGE, rows.length)}</span> of{' '}
              <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-100">{rows.length} records</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50/50 rounded-lg">
              Page {currentPage} <span className="text-slate-300 mx-1">/</span> {totalPages}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
