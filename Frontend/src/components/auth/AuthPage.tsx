import { useState } from 'react';
import { SignInForm } from './SignInForm.tsx';
import { RegistrationForm } from './RegistrationForm.tsx';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-aurora">
      {isRegistering ? (
        <div>
          <RegistrationForm setIsRegistering={setIsRegistering} />
        </div>
      ) : (
        <div>
          <SignInForm setIsRegistering={setIsRegistering} />
        </div>
      )}
    </div>
  );
}

export default App;