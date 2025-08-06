import * as XLSX from 'xlsx';
import { Question, QuestionType } from '../types/exam';
import { v4 as uuidv4 } from 'uuid';

export interface ExcelQuestion {
  'Question ID': string;
  'Question Text': string;
  'Type': string;
  'Category': string;
  'Difficulty': string;
  'Option A': string;
  'Option B': string;
  'Option C': string;
  'Option D': string;
  'Correct Answer': string;
  'Points': number;
  'Explanation': string;
  'Reference': string;
}

export const parseExcelFile = async (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: ExcelQuestion[] = XLSX.utils.sheet_to_json(worksheet);
        
        const questions: Question[] = jsonData.map((row, index) => {
          const type = mapQuestionType(row.Type);
          const options = type.includes('mcq') 
            ? [row['Option A'], row['Option B'], row['Option C'], row['Option D']].filter(Boolean)
            : undefined;
          
          return {
            id: row['Question ID'] || uuidv4(),
            text: row['Question Text'],
            type,
            options,
            correctAnswer: parseCorrectAnswer(row['Correct Answer'], type),
            points: row.Points || 1,
            explanation: row.Explanation ? `${row.Explanation}${row.Reference ? ` (Ref: ${row.Reference})` : ''}` : '',
          };
        });
        
        resolve(questions);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

const mapQuestionType = (typeString: string): QuestionType => {
  const type = typeString.toLowerCase().trim();
  
  if (type.includes('mcq') && type.includes('multiple')) return 'mcq-multiple';
  if (type.includes('mcq') || type.includes('multiple choice')) return 'mcq-single';
  if (type.includes('true') || type.includes('false')) return 'true-false';
  if (type.includes('fill') || type.includes('blank')) return 'fill-blank';
  
  return 'mcq-single'; // default
};

const parseCorrectAnswer = (answer: string, type: QuestionType): string | string[] => {
  if (type === 'mcq-multiple') {
    return answer.split(',').map(a => a.trim());
  }
  return answer.trim();
};

export const generateExcelTemplate = (): Uint8Array => {
  const data = [
    {
      'Question ID': 'Q001',
      'Question Text': 'What is the normal range for adult resting heart rate?',
      'Type': 'MCQ-Single',
      'Category': 'Cardiology',
      'Difficulty': 'Basic',
      'Option A': '40-60 bpm',
      'Option B': '60-100 bpm',
      'Option C': '100-120 bpm',
      'Option D': '120-140 bpm',
      'Correct Answer': 'C',
      'Points': 1,
      'Explanation': 'Normal adult resting heart rate ranges from 60-100 beats per minute.',
      'Reference': 'AHA Guidelines 2024'
    },
    {
      'Question ID': 'Q002',
      'Question Text': 'Hand hygiene should be performed before and after patient contact.',
      'Type': 'True-False',
      'Category': 'Infection Control',
      'Difficulty': 'Basic',
      'Option A': '',
      'Option B': '',
      'Option C': '',
      'Option D': '',
      'Correct Answer': 'True',
      'Points': 1,
      'Explanation': 'Hand hygiene is the most important measure to prevent healthcare-associated infections.',
      'Reference': 'WHO Hand Hygiene Guidelines'
    },
  ];
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Questions');
  
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
};