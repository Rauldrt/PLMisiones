import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase-admin/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FormSubmission } from '@/lib/types';

// Helper function to safely initialize and get the Firebase Admin app
function getAdminApp(): App | null {
    const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!serviceAccountB64) {
        console.error('Firebase Admin service account is missing. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 in your environment variables.');
        return null;
    }
    
    try {
        const serviceAccount = JSON.parse(Buffer.from(serviceAccountB64, 'base64').toString('utf-8'));
        const appName = 'firebase-admin-app-PLM-submissions';
        const existingApp = getApps().find(app => app.name === appName);
        
        if (existingApp) {
            return existingApp;
        }

        return initializeApp({
            credential: cert(serviceAccount)
        }, appName);

    } catch (error) {
        console.error("Failed to initialize Firebase Admin app:", error);
        return null;
    }
}

async function getFormSubmissions(formName: string): Promise<FormSubmission[]> {
  const adminApp = getAdminApp();
  if (!adminApp) {
    console.error("Firebase Admin App is not initialized. Cannot fetch form submissions.");
    return [];
  }

  try {
    const db = getFirestore(adminApp);
    const q = query(collection(db, `submissions-${formName}`), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const submissions: FormSubmission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Firestore Timestamps need to be converted to a serializable format
      const submittedAt = data.submittedAt?.toDate ? data.submittedAt.toDate().toLocaleString('es-AR') : 'N/A';
      
      submissions.push({
        id: doc.id,
        ...data,
        submittedAt,
      });
    });

    return submissions;
  } catch (error) {
    console.error(`Error fetching submissions from collection ${formName}:`, error);
    if (error instanceof Error && error.message.includes('permission-denied')) {
        console.error("Firestore permission denied. Check your Firestore rules and admin SDK initialization.");
    }
    return [];
  }
}

const formNames = ['afiliacion', 'contacto', 'fiscales'];

function RenderTable({ data }: { data: FormSubmission[] }) {
    if (data.length === 0) {
      return <p className="text-muted-foreground">No hay envíos para este formulario todavía.</p>;
    }
    
    const allHeaders = data.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, [] as string[]);
    
    const orderedHeaders = ['submittedAt', 'nombreCompleto', 'email', 'telefono', 'dni', 'localidad', 'asunto', 'mensaje'].filter(h => allHeaders.includes(h));
    const otherHeaders = allHeaders.filter(h => !orderedHeaders.includes(h) && h !== 'id');
    const headers = [...orderedHeaders, ...otherHeaders];


    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => <TableHead key={header} className="capitalize">{header.replace(/([A-Z])/g, ' $1')}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {headers.map(header => <TableCell key={header}>{String(row[header] ?? '')}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
};

export default async function FirestoreDataPage() {
    const [afiliacionData, contactoData, fiscalesData] = await Promise.all([
        getFormSubmissions('afiliacion'),
        getFormSubmissions('contacto'),
        getFormSubmissions('fiscales'),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Datos de Formularios (Firestore)</h1>
                <p className="text-muted-foreground">Visualización directa de los datos almacenados en Firestore.</p>
            </div>

            <Tabs defaultValue={formNames[0]}>
                <TabsList>
                    {formNames.map(name => (
                        <TabsTrigger key={name} value={name} className="capitalize">{name}</TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="afiliacion">
                    <Card>
                        <CardHeader>
                            <CardTitle>Envíos de Afiliación</CardTitle>
                            <CardDescription>Personas que completaron el formulario para afiliarse.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RenderTable data={afiliacionData} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="contacto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Envíos de Contacto</CardTitle>
                            <CardDescription>Mensajes y consultas enviadas desde el pie de página.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RenderTable data={contactoData} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="fiscales">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inscripciones de Fiscales</CardTitle>
                            <CardDescription>Voluntarios que se inscribieron para fiscalizar.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RenderTable data={fiscalesData} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}