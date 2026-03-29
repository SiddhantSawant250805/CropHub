# CropHub Terra Layer - Real-World Implementation Checklist

The Terra Layer engine (Python microservice) has been set up to handle location-based API fetching and OpenCV/MobileNetV2 processing. However, because it runs on actual datasets, models, and cloud accounts, you must complete the steps below to bring it to life.

## 1. Machine Learning Assets
- [ ] **Soil Image Dataset**: Download a dataset (like the [Soil Types Dataset on Kaggle](https://www.kaggle.com/datasets)) to train or fine-tune your model.
- [ ] **Train/Export MobileNetV2**: You will need to write a script in Google Colab to fine-tune `tf.keras.applications.MobileNetV2` on your downloaded dataset.
- [ ] **Save the Model File**: Once trained, save the `.h5` file and place it at `e:\Projects\CropHub\terra_layer\model.h5`. The Python code is already looking for this exact file.
- [ ] **The Agronomy Logic Matrix**: You need to structure an Excel spreadsheet mapping specific NPK, pH, Temperature, and Rainfall to Crops & Actions. The current `analyzer.py` contains the base `if/elif` logic skeleton; you can expand those branches based on your Excel spreadsheet.

## 2. Cloud Accounts & Infrastructure
- [ ] **AWS S3 Bucket setup for Image Uploads**: 
  - Create an S3 Bucket and enable public block access (or specific IAM logic).
  - Configure CORS policies to allow PUT/POST from your Next.js frontend (e.g., `["http://localhost:3000"]`).
- [ ] **AWS IAM User**: Create an IAM User with *AmazonS3FullAccess* (or limited to your bucket) and copy the `Access Key ID` and `Secret Access Key` to your `server/.env` file.
- [ ] **MongoDB Atlas**:
  - Go to your MongoDB Atlas dashboard.
  - In Network Access, whitelist your backend's IP address (or `0.0.0.0/0` for testing).

## 3. UI/UX & Legal Compliance
- [ ] **SSL & HTTPS Integration**: If you deploy this publicly, modern browsers **require HTTPS** to use the Geolocation API and Camera API. You will need a domain name and an SSL certificate (e.g., via Let's Encrypt, Vercel, or Netlify).
- [ ] **3D Assets & Animations**: You can export `.spline` or `.json` formats for LottieFiles. Add them to `client/public/`. 
- [ ] **Geolocation Consent & Disclaimers**: Write clear UI copy that explains why GPS is needed (e.g., "CropHub needs your location to provide accurate regional soil and weather data.") and add an Agronomic Liability Disclaimer at the bottom of the Terra Report.
