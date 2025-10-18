# Jenkins Pipeline Setup for VirgoHealthcare Cypress Tests

## 🚀 **Quick Setup Guide**

### **1. Prerequisites**
- Jenkins server with Node.js plugin installed
- Node.js 18+ installed on Jenkins agent
- Email notification plugin (for daily reports)
- HTML Publisher plugin
- Git plugin

### **2. Create New Pipeline Job**
1. Go to Jenkins Dashboard
2. Click "New Item"
3. Enter job name: `VirgoHealthcare-Cypress-Tests`
4. Select "Pipeline" type
5. Click "OK"

### **3. Configure Pipeline**
1. **General Settings:**
   - ✅ Discard old builds (keep last 30 builds)
   - ✅ GitHub project: `https://github.com/your-org/VirgoHealthcare_cypress`

2. **Build Triggers:**
   - ✅ GitHub hook trigger for GITScm polling
   - ✅ Build periodically: `0 6 * * *` (Daily at 6 AM)

3. **Pipeline Configuration:**
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: `https://github.com/your-org/VirgoHealthcare_cypress.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

### **4. Environment Variables**
Set these in Jenkins → Manage Jenkins → Configure System → Global Properties:

```
CYPRESS_BASE_URL=https://www.virgohealthcare.in
CYPRESS_API_URL=https://api.virgohealthcare.in
CYPRESS_ADMIN_EMAIL=admin@virgohealthcare.com
CYPRESS_ADMIN_PASSWORD=AdminPassword123!
CYPRESS_TEST_USER_EMAIL=test@virgohealthcare.com
CYPRESS_TEST_USER_PASSWORD=TestPassword123!
```

### **5. Email Configuration**
Configure SMTP settings in Jenkins → Manage Jenkins → Configure System → E-mail Notification:

- SMTP server: `smtp.gmail.com` (or your SMTP server)
- Default user e-mail suffix: `@virgohealthcare.com`
- ✅ Use SMTP Authentication
- ✅ Use SSL
- Port: 587

### **6. Required Jenkins Plugins**
Install these plugins:
- Pipeline
- NodeJS Plugin
- HTML Publisher Plugin
- Email Extension Plugin
- Git Plugin
- Build Timestamp Plugin

## 📊 **Daily Report Features**

### **Automated Scheduling**
- **Daily at 6 AM UTC**: Runs all smoke tests
- **Manual Trigger**: Run specific test types (smoke/regression/all)
- **Browser Selection**: Chrome, Firefox, or Edge
- **Headless Mode**: Configurable

### **Report Generation**
- **HTML Reports**: Detailed test results with screenshots
- **Video Recordings**: Full test execution videos
- **Combined Dashboard**: All test results in one place
- **Email Notifications**: Daily summary emails

### **Report Access**
- Jenkins Dashboard → Your Job → HTML_Report
- Direct links to:
  - Smoke Test Report
  - Regression Test Report
  - Test Videos
  - Screenshots
  - Console Output

## 🎯 **Test Execution Options**

### **Parameterized Builds**
When running manually, you can select:
- **Browser**: Chrome, Firefox, Edge
- **Test Type**: Smoke, Regression, All
- **Headless Mode**: True/False

### **Command Line Execution**
```bash
# Run specific test type
curl -X POST "http://your-jenkins-url/job/VirgoHealthcare-Cypress-Tests/buildWithParameters?TEST_TYPE=smoke&BROWSER=chrome"

# Run all tests
curl -X POST "http://your-jenkins-url/job/VirgoHealthcare-Cypress-Tests/buildWithParameters?TEST_TYPE=all&BROWSER=chrome&HEADLESS=true"
```

## 📧 **Daily Email Reports**

### **Success Email Template**
```
Subject: ✅ VirgoHealthcare Tests PASSED - Build 123
Body: Test results summary with links to detailed reports
```

### **Failure Email Template**
```
Subject: ❌ VirgoHealthcare Tests FAILED - Build 124
Body: Failure summary with links to logs and screenshots
```

## 🔧 **Troubleshooting**

### **Common Issues**
1. **Node.js not found**: Install Node.js plugin and configure version 18+
2. **Cypress binary issues**: Ensure Cypress is installed in pipeline
3. **Permission errors**: Check Jenkins agent permissions
4. **Email not sending**: Verify SMTP configuration

### **Pipeline Debugging**
- Check Jenkins console output
- Verify environment variables
- Test individual pipeline stages
- Check artifact uploads

## 📈 **Monitoring & Analytics**

### **Build History**
- View test trends over time
- Track pass/fail rates
- Monitor execution times
- Browser compatibility reports

### **Notifications**
- Slack integration (optional)
- Teams integration (optional)
- Custom webhooks
- Email alerts

## 🚀 **Advanced Features**

### **Parallel Execution**
The pipeline supports running tests in parallel across multiple browsers.

### **Artifact Management**
- Automatic cleanup of old artifacts
- Video compression
- Screenshot optimization
- Report archiving

### **Integration Options**
- GitHub webhooks
- Bitbucket integration
- GitLab CI integration
- Docker container support

---

## 📞 **Support**

For setup assistance or issues:
- Check Jenkins logs
- Review Cypress documentation
- Contact DevOps team
- Create issue in repository
