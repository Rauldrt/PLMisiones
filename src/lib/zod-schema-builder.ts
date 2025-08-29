import { z } from 'zod';
import type { FormDefinition, FormFieldDefinition } from './types';

export function buildZodSchema(formDefinition: FormDefinition) {
  const shape: Record<string, z.ZodTypeAny> = {};

  formDefinition.fields.forEach((field: FormFieldDefinition) => {
    let zodType: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
        zodType = z.string();
        break;
      case 'email':
        zodType = z.string().email({ message: "Correo electrónico inválido" });
        break;
      case 'tel':
        zodType = z.string();
        break;
      case 'number':
        zodType = z.coerce.number();
        break;
      default:
        zodType = z.string();
    }

    if (field.required) {
      if (zodType instanceof z.ZodString) {
        zodType = zodType.min(1, { message: `${field.label} es requerido` });
      } else {
        zodType = zodType.refine((val) => val !== null && val !== undefined, {
          message: `${field.label} es requerido`,
        });
      }
    }
    
    shape[field.name] = zodType;
  });

  return z.object(shape);
}
