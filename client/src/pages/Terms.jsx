import React from 'react';

const Terms = () => {
  return (
    <div className="container py-5 fade-in-up" style={{ marginTop: '80px', maxWidth: '800px' }}>
      <div className="card border-0 glass-card p-4">
        <h2 className="fw-bold mb-4">Terms and Conditions</h2>
        <p className="text-muted">Last updated: July 2026</p>

        <div className="text-secondary lh-lg d-flex flex-column gap-3 mt-4">
          <p>
            Welcome to HouseHunt! These terms and conditions outline the rules and regulations for the use of HouseHunt's Website.
          </p>

          <h5 className="fw-bold text-primary mt-2">1. Acceptance of Terms</h5>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use HouseHunt if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h5 className="fw-bold text-primary mt-2">2. User Account Security</h5>
          <p>
            When you create an account, you represent and warrant that the information you provide is accurate and complete. You are solely responsible for maintaining the confidentiality of your account credentials, and you agree to accept responsibility for any activities that occur under your account.
          </p>

          <h5 className="fw-bold text-primary mt-2">3. Property Listing Guidelines</h5>
          <p>
            Landlords and owners are responsible for ensuring that their listed properties exist, are described accurately, and conform to local building and occupancy laws. HouseHunt reserves the right to reject, unapprove, or delete any listing deemed fraudulent or spam by our administrative team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
