
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { buildZodSchema } from '@/lib/zod-schema-builder';
import { getFormDefinitionAction } from '@/actions/data';

export async function handleFormSubmission(formName: string, formData: unknown) {
  try {
    const formDefinition = await getFormDefinitionAction(formName);
    const schema = buildZodSchema(formDefinition);

    const validatedData = schema.parse(formData);

    const filePath = path.join(process.cwd(), `src/data/form-submissions-${formName}.json`);
    let submissions: any[] = [];
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        if (fileContent) {
          submissions = JSON.parse(fileContent);
        }
    } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
    }


    submissions.push({
      ...validatedData,
      submittedAt: new Date().toISOString(),
    });

    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));

    revalidatePath(`/admin/view-submissions`);

    return { success: true, message: 'Formulario enviado con éxito.' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Por favor, corrija los errores en el formulario.', errors: error.flatten().fieldErrors };
    }
    console.error(`Error processing form ${formName}:`, error);
    return { success: false, message: 'Ocurrió un error al procesar el formulario. Por favor, intente de nuevo.' };
  }
}
