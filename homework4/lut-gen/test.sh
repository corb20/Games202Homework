#!/bin/bash
rm -rf build
mkdir build
cd build
cmake ..
make -j8
./lut-Emu-MC
./lut-Emu-IS
./lut-Eavg-MC
./lut-Eavg-IS
cd ..