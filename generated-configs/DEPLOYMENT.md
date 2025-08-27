
Deployment Instructions for Coders in Flow
========================================

1. Copy nginx configuration:
   scp -P 12222 generated-configs/nginx-codersinflow.conf root@ny:/etc/nginx/sites-available/codersinflow.conf
   
2. Copy systemd services:
   scp -P 12222 generated-configs/*.service root@ny:/etc/systemd/system/
   
3. Enable services on server:
   ssh -p 12222 root@ny
   systemctl daemon-reload
   systemctl enable codersinflow-backend
   systemctl enable codersinflow-frontend
   ln -s /etc/nginx/sites-available/codersinflow.conf /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx

4. Start services:
   systemctl start codersinflow-backend
   systemctl start codersinflow-frontend

Generated JWT Secret: ee170b657cb4d826d4e8f1fba2b5522a97ae8b3a17f12a53f268c4dda8707f4b
Save this securely!
