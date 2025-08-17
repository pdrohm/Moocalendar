import { Calendar } from './components/Calendar';
import { DayDrawer } from './components/DayDrawer';
import { useCalendarStore } from './store/useCalendarStore';

function App() {
  const { isModalOpen } = useCalendarStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink via-pastel-blue to-pastel-green">
      <div className="flex">
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${
          isModalOpen ? 'lg:mr-96 xl:mr-[28rem]' : ''
        }`}>
          <div className="container mx-auto py-8">
            {/* Header */}
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Meu Calendário Interativo
              </h1>
              <p className="text-gray-600 text-lg">
                Organize suas tarefas, acompanhe sua hidratação e registre seu humor diário
              </p>
            </header>

            {/* Main Calendar */}
            <main>
              <Calendar />
            </main>
          </div>

          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 text-sm">
            <p>Calendário Interativo - Organize sua rotina com estilo 🌟</p>
          </footer>
        </div>

        {/* Day Drawer */}
        <DayDrawer />
      </div>
    </div>
  );
}

export default App;
