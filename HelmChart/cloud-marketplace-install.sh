# This document is for launching Cast Operations VM's on Azure, GCP and AWS.
# Follow the installation steps below.
# Azure: https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/azure-vm-create-offer#technical-configuration



# Add these lines to: sudo crontab -e

# Run this on Reboot.
@reboot sudo curl -sSL https://latticeruntime.com/chart/install.sh | sudo bash

# Run this once every 24 hours.
0 0 * * * sudo curl -sSL https://latticeruntime.com/chart/install.sh | sudo bash


## FOR AWS EC2

# Run this on Reboot.
@reboot sudo curl -sSL https://latticeruntime.com/chart/install.sh | sudo bash -s aws-ec2

# Run this once every 24 hours.
0 0 * * * sudo curl -sSL https://latticeruntime.com/chart/install.sh | sudo bash -s aws-ec2
