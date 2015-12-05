###Welcome

## Install Environment:
####Requirements
You need to have vagrant installed https://www.vagrantup.com/downloads.html, then install these following tools:

<pre>
$ vagrant plugin install vagrant-vbguest
</pre>

#### Install project locally
Run command lines in order to set up the project in your machine :

<pre>
$ git clone -b develop https://github.com/JihadMotii-REISys/doe-eia.git
$ cd doe-eia/conf/vagrant
$ vagrant up    #Proceed to next command even this command returns error messages
$ vagrant provision --provision-with shell   #sync your local environment with updated dev dependencies
$ vagrant ssh
$ cd /var/www/doe-eia
</pre>

After the VM is up and running, these are the following command to use for vagrant to start, shutdown, delete your current VM:

<pre>
$ vagrant up        # Install/Run the VM
$ vagrant halt      # shutdown the VM
$ vagrant destroy   # remove the VM
$ vagrant ssh       # access to your VM (SSH)
</pre>

######Note: the IP address allocated to this new VM Box is 192.168.56.107 and if you have used this IP Address, you can change it in `conf/vagrant/puphpet/config.yaml`

#####Run the application without docker

Inside your vagrant VM, run the following command

<pre>
$ cd /var/www/doe-eia/src
$ gulp serve
</pre>

Browse URL: http://192.168.56.107:9000/