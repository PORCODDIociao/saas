import { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, Lock, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documents({ plan }) {
  const [files, setFiles] = useState(() => {
    const stored = localStorage.getItem('nomad_documents');
    return stored ? JSON.parse(stored) : [];
  });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  if (plan !== 'BUSINESS') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="p-5 bg-dark-800 border border-dark-700 rounded-3xl max-w-md">
          <Lock size={40} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Tax Proof Folder</h3>
          <p className="text-gray-400 mb-6">Archivia biglietti aerei, contratti Airbnb e documentazione fiscale associata ai tuoi viaggi. Funzione esclusiva del piano <strong className="text-accent">Legal Shield Business</strong>.</p>
          <Link to="/pricing" className="bg-accent text-dark-900 font-bold px-6 py-3 rounded-xl hover:bg-accent-hover transition-colors">
            Passa a Business →
          </Link>
        </div>
      </div>
    );
  }

  const saveFiles = (newFiles) => {
    setFiles(newFiles);
    // In futuro: Supabase Storage upload
    localStorage.setItem('nomad_documents', JSON.stringify(newFiles));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleInputChange = (e) => {
    processFiles(Array.from(e.target.files));
  };

  const processFiles = (newFiles) => {
    const processed = newFiles.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      type: f.type,
      date: new Date().toLocaleDateString('it-IT'),
    }));
    saveFiles([...files, ...processed]);
  };

  const deleteFile = (id) => saveFiles(files.filter(f => f.id !== id));

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Tax Proof Folder</h2>
        <p className="text-gray-400 text-sm">Archivia i tuoi documenti fiscali di prova. Verranno salvati su Supabase quando configurato.</p>
      </div>

      {/* UPLOAD AREA */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-accent bg-accent/5' : 'border-dark-600 hover:border-dark-500 bg-dark-800'}`}
      >
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleInputChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
        <UploadCloud size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg font-bold text-white">Trascina i file qui</h3>
        <p className="text-sm text-gray-400 mt-1">o clicca per selezionarli — PDF, Immagini, Documenti</p>
      </div>

      {/* FILES LIST */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-dark-700 flex justify-between items-center">
          <h3 className="font-bold text-white">Documenti Archiviati</h3>
          <span className="text-xs text-gray-500">{files.length} file</span>
        </div>
        {files.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Paperclip size={40} className="mx-auto mb-3 opacity-20" />
            <p>Nessun documento. Carica fatture Airbnb, biglietti aerei, contratti.</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700/50">
            {files.map(f => (
              <div key={f.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-dark-700/20">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-dark-700 rounded-xl text-accent"><FileText size={20} /></div>
                  <div>
                    <p className="text-white font-medium">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.size} · Caricato il {f.date}</p>
                  </div>
                </div>
                <button onClick={() => deleteFile(f.id)} className="p-2 text-gray-600 hover:text-danger rounded-xl hover:bg-danger/10 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
