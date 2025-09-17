
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { buildZodSchema } from '@/lib/zod-schema-builder';
import { getFormDefinitionAction } from '@/actions/data';
import { saveSubmission } from '@/lib/firebase/firestore';

export async function handleFormSubmission(formName: string, formData: unknown) {
  try {
    const formDefinition = await getFormDefinitionAction(formName);
    const schema = buildZodSchema(formDefinition);

    const validatedData = schema.parse(formData);
    
    const collectionName = `submissions-${formName}`;
    await saveSubmission(collectionName, validatedData);

    revalidatePath(`/admin/view-submissions`);
    revalidatePath(`/admin/firestore-data`);

    return { success: true, message: 'Formulario enviado con éxito.' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Por favor, corrija los errores en el formulario.', errors: error.flatten().fieldErrors };
    }
    console.error(`Error processing form ${formName}:`, error);
    return { success: false, message: 'Ocurrió un error al procesar el formulario. Por favor, intente de nuevo.' };
  }
}
