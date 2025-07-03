import DeviceDetector from '@/components/DeviceDetector';
import MobileApp from '@/components/MobileApp';
import QRReader from '@/components/QRReader';

export default function Home() {
  return (
    <DeviceDetector
      onMobile={<MobileApp />}
      onDesktop={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
          <div className="max-w-2xl mx-auto pt-8">
            <QRReader />
          </div>
        </div>
      }
    />
  );
}
