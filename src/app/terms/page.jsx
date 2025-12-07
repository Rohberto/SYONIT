import Header from '../Components/MainHeader/mainHeader';
import "./terms.css";
const TermsAndConditions = () => {
  return (
    <div className="terms-page container">
  

      <Header />
      <h1 className="terms-title">Terms and Conditions</h1>
      <div className="terms-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using our services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.
        </p>
      </div>
      <div className="terms-section">
        <h2>2. User Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use.
        </p>
      </div>
      <div className="terms-section">
        <h2>3. Limitation of Liability</h2>
        <p>
          Our platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.
        </p>
      </div>
      <div className="terms-section">
        <h2>4. Changes to Terms</h2>
        <p>
          We may update these Terms and Conditions from time to time. Continued use of the platform constitutes acceptance of the updated terms.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;