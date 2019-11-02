#!/bin/bash

# The argument with .pde removed
base=${1%.pde}

# The folder where we will store the sketch
p5path="/tmp/$base"

# Remove the folder if it exists...
rm -rf $p5path

# ...and create it again
mkdir $p5path

# Symlink the data folder
ln -s "$(realpath data)" $p5path/data

# Symlink the pde file
ln -s "$(realpath $1)" $p5path/$1

# Run!
/home/educ3/Documents/processing-3.5.3/processing-java --sketch=$p5path --run
