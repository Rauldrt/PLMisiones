'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitFormAction } from '@/actions/submissions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Award, 
  RotateCcw,
  MessageCircle,
  UserCheck,
  Zap,
  Lock,
  HeartHandshake
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  pillar: 'vida' | 'libertad' | 'propiedad' | 'estado';
  pillarLabel: string;
  pillarIcon: string;
  question: string;
  options: {
    text: string;
    score: number; // 100 for libertarian, 0 for statist
    label: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pilar_vida',
    pillar: 'vida',
    pillarLabel: 'La Vida y Responsabilidad',
    pillarIcon: '🧬',
    question: '¿Quién es el dueño y máximo responsable de tu vida, tu tiempo y tus decisiones?',
    options: [
      {
        text: 'Yo mismo. La vida y la libertad individual son sagradas e inviolables.',
        score: 100,
        label: 'A'
      },
      {
        text: 'El Estado, que debe tutelar y regular mis decisiones personales.',
        score: 0,
        label: 'B'
      }
    ]
  },
  {
    id: 'pilar_libertad',
    pillar: 'libertad',
    pillarLabel: 'La Libertad y el Emprendimiento',
    pillarIcon: '🗽',
    question: 'Frente al comercio y a los jóvenes que quieren emprender o trabajar en Misiones:',
    options: [
      {
        text: 'Menos trabas, libre competencia e impuestos mínimos para generar progreso real.',
        score: 100,
        label: 'A'
      },
      {
        text: 'Más controles estatales, tasas municipales y regulaciones de precios.',
        score: 0,
        label: 'B'
      }
    ]
  },
  {
    id: 'pilar_propiedad',
    pillar: 'propiedad',
    pillarLabel: 'La Propiedad Privada',
    pillarIcon: '💎',
    question: 'El fruto legítimo de tu esfuerzo, tu trabajo y tu ahorro personal le pertenece a:',
    options: [
      {
        text: 'A quien lo generó con su esfuerzo. La propiedad privada debe ser respetada.',
        score: 100,
        label: 'A'
      },
      {
        text: 'Al Estado, que debe apropiarlo y redistribuirlo discrecionalmente.',
        score: 0,
        label: 'B'
      }
    ]
  },
  {
    id: 'pilar_estado',
    pillar: 'estado',
    pillarLabel: 'El Rol del Estado',
    pillarIcon: '🏛️',
    question: '¿Cuál debe ser el límite y la función primordial del gobierno?',
    options: [
      {
        text: 'Garantizar la seguridad, la justicia y la defensa de los derechos fundamentales.',
        score: 100,
        label: 'A'
      },
      {
        text: 'Manejar empresas, fijar salarios y decidir el destino de los ciudadanos.',
        score: 0,
        label: 'B'
      }
    ]
  }
];

interface ParticipaQuizModalProps {
  onClose?: () => void;
}

export function ParticipaQuizModal({ onClose }: ParticipaQuizModalProps) {
  const [step, setStep] = useState<'userData' | 'quiz' | 'result'>('userData');
  const [userData, setUserData] = useState({
    name: '',
    locality: '',
    phone: '',
  });
  const [answers, setAnswers] = useState<Record<string, { text: string; score: number }>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.name.trim() || !userData.locality.trim() || !userData.phone.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campos requeridos',
        description: 'Por favor completá tu nombre, localidad y teléfono para comenzar.',
      });
      return;
    }
    setStep('quiz');
  };

  const handleSelectOption = (option: { text: string; score: number }) => {
    const q = QUIZ_QUESTIONS[currentQuestionIdx];
    const newAnswers = {
      ...answers,
      [q.id]: option
    };
    setAnswers(newAnswers);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Calculate final score and submit
      const totalScore = Object.values(newAnswers).reduce((acc, curr) => acc + curr.score, 0);
      const averageScore = Math.round(totalScore / QUIZ_QUESTIONS.length);

      const submissionPayload = {
        name: userData.name.trim(),
        locality: userData.locality.trim(),
        phone: userData.phone.trim(),
        score: `${averageScore}% Afinidad Libertaria`,
        pilar_vida: newAnswers['pilar_vida']?.text || '',
        pilar_libertad: newAnswers['pilar_libertad']?.text || '',
        pilar_propiedad: newAnswers['pilar_propiedad']?.text || '',
        pilar_estado: newAnswers['pilar_estado']?.text || '',
      };

      startTransition(async () => {
        try {
          await submitFormAction('test_libertario', submissionPayload);
        } catch (err) {
          console.error("Failed to save quiz submission:", err);
        }
        setStep('result');
      });
    }
  };

  const calculateFinalScore = () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(totalScore / QUIZ_QUESTIONS.length);
  };

  const finalScore = calculateFinalScore();

  return (
    <div className="w-full text-foreground">
      {/* ----------------- PASO 1: DATOS PERSONALES ----------------- */}
      {step === 'userData' && (
        <div className="space-y-3.5 animate-fade-in-up">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full fluent-icon-badge-3d text-primary text-[10px] font-extrabold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 drop-shadow-[0_1px_2px_rgba(245,158,11,0.5)]" />
              <span>Paso 1: Queremos Conocerte</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="text-xl p-1 rounded-xl fluent-icon-badge-3d inline-flex items-center justify-center shadow-sm">
                🦁
              </span>
              <h3 className="font-headline text-lg font-extrabold text-foreground tracking-tight">
                ¡Sumate al Movimiento!
              </h3>
            </div>

            <p className="text-[11px] text-muted-foreground leading-tight font-medium">
              Ingresá tus datos para poner a prueba tu visión sobre las ideas de la libertad.
            </p>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-2.5 pt-1">
            <div className="space-y-1">
              <Label htmlFor="quiz-name" className="text-[11px] font-bold text-foreground/90 flex items-center gap-1">
                <span>Nombre y Apellido</span>
                <span className="text-primary">*</span>
              </Label>
              <Input
                id="quiz-name"
                placeholder="Ej. Juan Pérez"
                className="h-9.5 text-xs rounded-xl fluent-tile-3d bg-background/60 focus:bg-background border-input/80 font-medium"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="quiz-locality" className="text-[11px] font-bold text-foreground/90 flex items-center gap-1">
                <span>Localidad / Municipio</span>
                <span className="text-primary">*</span>
              </Label>
              <Input
                id="quiz-locality"
                placeholder="Ej. Posadas, Oberá, Eldorado, etc."
                className="h-9.5 text-xs rounded-xl fluent-tile-3d bg-background/60 focus:bg-background border-input/80 font-medium"
                value={userData.locality}
                onChange={(e) => setUserData({ ...userData, locality: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="quiz-phone" className="text-[11px] font-bold text-foreground/90 flex items-center gap-1">
                <span>Teléfono / WhatsApp</span>
                <span className="text-primary">*</span>
              </Label>
              <Input
                id="quiz-phone"
                type="tel"
                placeholder="Ej. +54 9 376 1234567"
                className="h-9.5 text-xs rounded-xl fluent-tile-3d bg-background/60 focus:bg-background border-input/80 font-medium"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl text-xs font-bold bg-gradient-to-r from-primary via-purple-600 to-fuchsia-600 hover:from-primary/95 hover:to-fuchsia-600/95 text-white shadow-[0_4px_16px_rgba(139,31,164,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-[0.98] transition-all mt-1 gap-2 border-t border-white/25"
            >
              <span>¡Comenzar el Test Libertario!</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}

      {/* ----------------- PASO 2: PREGUNTAS DEL TEST ----------------- */}
      {step === 'quiz' && (
        <div className="space-y-3.5 animate-fade-in-up">
          {/* Barra de progreso con efecto 3D */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg fluent-icon-badge-3d text-primary font-bold text-[10px]">
                <span className="text-sm">{QUIZ_QUESTIONS[currentQuestionIdx].pillarIcon}</span>
                <span>{QUIZ_QUESTIONS[currentQuestionIdx].pillarLabel}</span>
              </span>
              <span className="px-2 py-0.5 rounded-md fluent-icon-badge-3d text-[10px]">
                {currentQuestionIdx + 1} de {QUIZ_QUESTIONS.length}
              </span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-muted/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] overflow-hidden p-0.5 border border-white/20">
              <div 
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-accent rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pregunta */}
          <div className="py-1">
            <h4 className="font-headline text-xs sm:text-sm font-extrabold text-foreground leading-snug tracking-tight">
              {QUIZ_QUESTIONS[currentQuestionIdx].question}
            </h4>
          </div>

          {/* Opciones con diseño Windows 11 Tile 3D */}
          <div className="space-y-2">
            {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option)}
                className="w-full text-left p-3 rounded-2xl fluent-tile-3d group flex items-start gap-3 active:scale-[0.98] transition-all"
              >
                <span className="w-6 h-6 rounded-lg fluent-icon-badge-3d text-primary font-black text-xs flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  {option.label}
                </span>
                <span className="text-[11px] sm:text-xs text-foreground/95 font-semibold leading-relaxed pt-0.5">
                  {option.text}
                </span>
              </button>
            ))}
          </div>

          {isPending && (
            <div className="text-center py-1 text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Calculando afinidad...</span>
            </div>
          )}
        </div>
      )}

      {/* ----------------- PASO 3: RESULTADOS ----------------- */}
      {step === 'result' && (
        <div className="space-y-3 text-center animate-fade-in-up py-0.5">
          <div className="inline-flex p-3 rounded-2xl fluent-icon-badge-3d text-primary shadow-lg">
            <Award className="w-9 h-9 text-primary drop-shadow-[0_4px_8px_rgba(139,31,164,0.4)] animate-bounce" />
          </div>

          <div className="space-y-0.5">
            <div className="text-xl font-black font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-accent tracking-tight">
              {finalScore >= 75 ? '¡100% LIBERTARIO! 🦁' : '¡ESPÍRITU LIBRE! ⚡'}
            </div>
            <p className="text-[11px] font-bold text-foreground/90 leading-tight">
              {userData.name}, compartís plenamente los principios de la Vida, la Libertad y la Propiedad Privada.
            </p>
          </div>

          <div className="p-3 rounded-2xl fluent-tile-3d text-[11px] text-muted-foreground leading-relaxed text-left">
            🎯 <strong className="text-foreground">Tu diagnóstico:</strong> Creés en el mérito, la libre competencia y en un Estado que no asfixie a los que producen. ¡Misiones necesita jóvenes con tus convicciones!
          </div>

          {/* Acciones para el usuario */}
          <div className="space-y-2 pt-0.5">
            <Button
              asChild
              className="w-full h-10 rounded-xl text-xs font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:to-emerald-600 text-white gap-2 shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-[0.98] transition-all border-t border-white/25"
            >
              <Link 
                href={`https://api.whatsapp.com/send?phone=5493765028907&text=${encodeURIComponent(`¡Hola! Hice el Test Libertario en la web (Afinidad: ${finalScore}%) y quiero sumarme a las actividades de los jóvenes en ${userData.locality}. Mi nombre es ${userData.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Sumarme al WhatsApp de Jóvenes</span>
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                asChild
                variant="outline"
                className="h-9 rounded-xl text-xs font-bold border-primary/40 text-primary hover:bg-primary/10 fluent-tile-3d"
              >
                <Link href="/afiliacion">
                  <UserCheck className="w-3.5 h-3.5 mr-1" />
                  <span>Afiliarme</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setStep('quiz');
                  setCurrentQuestionIdx(0);
                }}
                className="h-9 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground fluent-tile-3d"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Repetir</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
