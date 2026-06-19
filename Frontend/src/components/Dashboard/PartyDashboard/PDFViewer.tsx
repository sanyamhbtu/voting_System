
import { motion } from 'framer-motion';
interface PDFViewerProps {
  url: string;
  title: string;
}

export default function PDFViewer ({ url, title }: PDFViewerProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass gradient-border rounded-3xl p-6 max-w-3xl mx-auto my-8"
    >
      <h3 className="text-2xl font-semibold font-display gradient-text mb-4">{title}</h3>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <iframe src={url} className='w-full h-[50vh] border-none'  ></iframe>
      </div>
    </motion.div>
  );
}
