import { env } from 'cloudflare:workers';
import { DataRemoval, LocalDataRemoval } from '@/components/data-controls';
import { PRIVACY_VERSION } from '@/lib/privacy';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Privacidad y tus datos · La Combi' };

export default function PrivacyPage() {
  const contact = (env as unknown as { PRIVACY_CONTACT_EMAIL?: string }).PRIVACY_CONTACT_EMAIL;
  return <main className="privacy-page">
    <a href="/">← Volver al mapa</a>
    <h1>Privacidad y tus datos</h1>
    <p>Versión {PRIVACY_VERSION}. La Combi es un proyecto independiente gestionado por Miranda Cavalie. Explorar el mapa y obtener un match no requiere registrarte ni enviar tus respuestas.</p>
    <h2>Qué guardamos y para qué</h2>
    <ul>
      <li><strong>Novedades:</strong> si aceptas, guardamos tu correo, fecha y versión del consentimiento. Solo para novedades de oportunidades. Plazo máximo: 24 meses desde el consentimiento, o hasta que solicites la baja. Actualmente recopilamos solicitudes; no enviamos campañas automáticas y los correos aún no están verificados.</li>
      <li><strong>Match compartido:</strong> solo al marcar la casilla opcional guardamos país, etapa, tipo de negocio, sector, objetivos, recomendaciones y fecha del consentimiento para conocer la demanda y mejorar la cobertura del mapa. Conservamos el último perfil compartido desde este navegador hasta 12 meses después de su actualización. No lo vinculamos al correo ni guardamos nombre, IP o ubicación precisa en esa tabla. No afirmamos que sea anónimo: combinaciones poco frecuentes podrían identificar a alguien.</li>
      <li><strong>Propuestas:</strong> guardamos información del programa y el correo opcional para revisar la sugerencia o pedir aclaraciones, hasta 12 meses. No añadas datos personales de terceros. Las propuestas nunca se publican sin revisión.</li>
    </ul>
    <h2>Almacenamiento del navegador y cookies</h2>
    <p>Usamos almacenamiento local para recordar tu perfil y guardados, y códigos privados que permiten eliminar los datos que decidas compartir. No añadimos cookies publicitarias, píxeles de marketing, seguimiento entre sitios ni herramientas externas de analítica. La casilla del match empieza desmarcada y el envío se realiza solo al confirmar tu elección. No hay un banner de «aceptar todo» porque no activamos ese seguimiento.</p>
    <p>Cloudflare procesa datos técnicos de conexión, como la IP, para entregar y proteger el sitio y limitar abusos. Estos no forman parte de la base de analítica del match. No registramos cuerpos de formularios, correos ni códigos privados en los logs de la aplicación.</p>
    <h2>Proveedores y acceso</h2>
    <p>El alojamiento y la base de datos utilizan Cloudflare, cuya infraestructura puede procesar datos fuera de tu país. GitHub contiene código y recursos públicos, no correos ni respuestas. Solo la responsable y personas expresamente autorizadas para mantenimiento deben acceder a los registros privados. No vendemos tus datos ni los entregamos a las aceleradoras; al visitar un enlace oficial se aplica la política de esa institución.</p>
    <p>La eliminación borra el registro activo. Las copias de recuperación de Cloudflare pueden conservar una versión anterior durante su plazo de recuperación, de hasta 30 días según el plan. No se usan para campañas ni analítica habitual.</p>
    <h2>Controla tus datos</h2>
    <p>Retirar el consentimiento no afecta tu acceso al mapa. Desmarcar el envío de un nuevo match no borra perfiles enviados antes: puedes eliminarlos aquí. No contamos usuarios únicos; un perfil representa un envío guardado por código privado, no necesariamente una persona.</p>
    <DataRemoval kind="match" />
    <DataRemoval kind="subscribe" />
    <LocalDataRemoval />
    <h2>Contacto y solicitudes</h2>
    {contact ? <p>Para acceso, corrección, eliminación, oposición o consultas, escribe a <a href={`mailto:${contact}`}>{contact}</a>. Si se trata del match, conserva el código privado: sin él no podemos localizar de forma fiable un perfil porque no lo vinculamos a tu correo. Verificaremos la solicitud de forma proporcional, sin pedir datos innecesarios.</p> : <p>El contacto está pendiente de configuración. La recepción de datos permanece desactivada hasta completarlo.</p>}
    <p>Este aviso describe el funcionamiento del servicio. Puede cambiar si incorporamos cuentas, envíos de correo o nuevos proveedores; solicitaremos una nueva elección cuando cambien las finalidades.</p>
  </main>;
}
