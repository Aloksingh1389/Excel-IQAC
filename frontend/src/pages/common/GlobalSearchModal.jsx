import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  Users, 
  Building2, 
  BookOpen, 
  FlaskConical, 
  GraduationCap, 
  FolderOpen, 
  FileText, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { getItem, STORAGE_KEYS } from '../../services/localStorageHelper';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load all searchable data from localStorage
  const searchableData = useMemo(() => {
    return {
      faculty: getItem(STORAGE_KEYS.FACULTY) || [],
      departments: getItem(STORAGE_KEYS.DEPARTMENTS) || [],
      publications: getItem(STORAGE_KEYS.PUBLICATIONS) || [],
      research: getItem(STORAGE_KEYS.RESEARCH) || [],
      students: getItem(STORAGE_KEYS.STUDENTS) || [],
      documents: getItem(STORAGE_KEYS.DOCUMENTS) || [],
      reports: getItem(STORAGE_KEYS.REPORTS) || [],
    };
  }, [isOpen]);

  // Perform grouped search
  const results = useMemo(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      return null;
    }

    const term = searchTerm.toLowerCase().trim();

    const facultyMatches = searchableData.faculty.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.employeeId.toLowerCase().includes(term) ||
        f.departmentName.toLowerCase().includes(term) ||
        f.designation.toLowerCase().includes(term)
    );

    const deptMatches = searchableData.departments.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.code.toLowerCase().includes(term) ||
        d.hodName.toLowerCase().includes(term)
    );

    const pubMatches = searchableData.publications.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.authors.toLowerCase().includes(term) ||
        p.journal.toLowerCase().includes(term) ||
        (p.indexing && p.indexing.toLowerCase().includes(term))
    );

    const resMatches = searchableData.research.filter(
      (r) =>
        r.projectTitle.toLowerCase().includes(term) ||
        r.principalInvestigator.toLowerCase().includes(term) ||
        r.fundingAgency.toLowerCase().includes(term)
    );

    const studentMatches = searchableData.students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.registerNumber.toLowerCase().includes(term) ||
        s.departmentName.toLowerCase().includes(term)
    );

    const docMatches = searchableData.documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.fileName.toLowerCase().includes(term) ||
        doc.module.toLowerCase().includes(term)
    );

    const totalCount =
      facultyMatches.length +
      deptMatches.length +
      pubMatches.length +
      resMatches.length +
      studentMatches.length +
      docMatches.length;

    return {
      faculty: facultyMatches,
      departments: deptMatches,
      publications: pubMatches,
      research: resMatches,
      students: studentMatches,
      documents: docMatches,
      totalCount,
    };
  }, [searchTerm, searchableData]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header Input */}
          <div className="relative border-b border-slate-200 p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-600 shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search faculty, publications, research, departments, documents..."
              className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
          </div>

          {/* Search Body Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
            {!searchTerm.trim() ? (
              <div className="py-10 text-center">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">Instant Institutional Search</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching for keywords like <span className="font-semibold text-blue-600">"Machine Learning"</span>,{' '}
                  <span className="font-semibold text-blue-600">"Rajesh Kumar"</span>, <span className="font-semibold text-blue-600">"DST"</span>, or <span className="font-semibold text-blue-600">"CSE"</span>.
                </p>
              </div>
            ) : results?.totalCount === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No matching results found for "<strong className="text-slate-800">{searchTerm}</strong>".
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Faculty Results */}
                {results.faculty.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 px-2">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-blue-600" /> Faculty
                      </span>
                      <span>{results.faculty.length} found</span>
                    </div>
                    <div className="space-y-1">
                      {results.faculty.map((f) => (
                        <div
                          key={f.id}
                          onClick={() => handleNavigate('/hod/faculty')}
                          className="p-2.5 rounded-lg hover:bg-blue-50/60 border border-transparent hover:border-blue-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{f.name}</div>
                            <div className="text-[11px] text-slate-500">{f.designation} &bull; {f.departmentName}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications Results */}
                {results.publications.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 px-2">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Publications
                      </span>
                      <span>{results.publications.length} found</span>
                    </div>
                    <div className="space-y-1">
                      {results.publications.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleNavigate('/publications')}
                          className="p-2.5 rounded-lg hover:bg-emerald-50/60 border border-transparent hover:border-emerald-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{p.title}</div>
                            <div className="text-[11px] text-slate-500">{p.journal} ({p.publicationYear}) &bull; {p.indexing}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Research Projects Results */}
                {results.research.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 px-2">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <FlaskConical className="w-3.5 h-3.5 text-indigo-600" /> Research & Grants
                      </span>
                      <span>{results.research.length} found</span>
                    </div>
                    <div className="space-y-1">
                      {results.research.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => handleNavigate('/research')}
                          className="p-2.5 rounded-lg hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{r.projectTitle}</div>
                            <div className="text-[11px] text-slate-500">{r.fundingAgency} &bull; ₹{(r.amount || 0).toLocaleString()}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Results */}
                {results.documents.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5 px-2">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <FolderOpen className="w-3.5 h-3.5 text-amber-600" /> Documents
                      </span>
                      <span>{results.documents.length} found</span>
                    </div>
                    <div className="space-y-1">
                      {results.documents.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleNavigate('/documents')}
                          className="p-2.5 rounded-lg hover:bg-amber-50/60 border border-transparent hover:border-amber-100 flex items-center justify-between cursor-pointer transition"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{doc.name}</div>
                            <div className="text-[11px] text-slate-500">{doc.module} &bull; {doc.fileSize}</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
