'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface ProjectUploadProps {
  onAnalysisComplete: (data: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

export function ProjectUpload({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ProjectUploadProps) {
  const { t, language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error(t.projectUpload.onlyPdf);
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error(t.projectUpload.maxSizeError);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(t.projectUpload.preparing);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('language', language);

      const response = await fetch('/api/analyzer/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al analizar el proyecto');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let partialRead = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        partialRead += decoder.decode(value, { stream: true });
        let lines = partialRead.split('\n');
        partialRead = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.status === 'processing') {
                setProgress(parsed.message || t.projectUpload.analyzing);
              } else if (parsed.status === 'completed') {
                onAnalysisComplete(parsed.result);
                toast.success(t.projectUpload.analysisComplete);
                setIsAnalyzing(false);
                return;
              } else if (parsed.status === 'error') {
                throw new Error(parsed.message || t.projectUpload.analysisError);
              }
            } catch (e: any) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || t.projectUpload.analysisError);
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-purple-600" />
          {t.projectUpload.title}
        </CardTitle>
        <CardDescription>
          {t.projectUpload.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-600 transition-colors cursor-pointer"
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isAnalyzing}
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t.projectUpload.clickToSelect}
            </p>
            <p className="text-xs text-gray-500">
              {t.projectUpload.maxSize}
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isAnalyzing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  {t.projectUpload.remove}
                </Button>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {progress}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {t.projectUpload.processingTime}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.projectUpload.analyzingProject}
              </>
            ) : (
              <>
                <Target className="mr-2 h-5 w-5" />
                {t.projectUpload.startAnalysis}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
