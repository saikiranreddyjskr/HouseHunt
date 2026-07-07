import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container py-5 fade-in-up" style={{ marginTop: '80px', maxWidth: '800px' }}>
      <div className="card border-0 glass-card p-4">
        <h2 className="fw-bold mb-4">Privacy Policy</h2>
        <p className="text-muted">Last updated: July 2026</p>

        <div className="text-secondary lh-lg d-flex flex-column gap-3 mt-4">
          <p>
            At HouseHunt, accessible from HouseHunt portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by HouseHunt and how we use it.
          </p>

          <h5 className="fw-bold text-primary mt-2">1. Information We Collect</h5>
          <p>
            We collect personal information that you provide to us, such as your name, email address, phone number, physical address, and password during registration. If you list a property, we collect descriptions, specifications, rent prices, and images.
          </p>

          <h5 className="fw-bold text-primary mt-2">2. How We Use Your Information</h5>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our rental website</li>
            <li>Improve, personalize, and expand our services</li>
            <li>Understand and analyze how you use our platform</li>
            <li>Develop new features, services, and functionalities</li>
            <li>Communicate with you for customer service and booking approvals</li>
          </ul>

          <h5 className="fw-bold text-primary mt-2">3. Cookies and Web Beacons</h5>
          <p>
            Like any other website, HouseHunt uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
