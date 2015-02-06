#! /bin/sh

REPO="https://github.com/TWtablero/tablero/"
BRANCH="master"
ARCHIVE="$REPO/tarball/${BRANCH}"
TARGET="tablero"

NC='\033[0m'
error() {
  color='\033[0;31m'
  echo "${color}$1${NC} "
}
info() {
  color='\033[0;32m'
  echo "${color}$1${NC} "
}

welcome() {
  info "We are going to install Tablero in your system"
}

has() {
  if ! [ -x "$(command -v $1)" ]; then
      false
  else
      true
  fi
}

has_and_notify() {
  if ! [ -x "$(command -v $1)" ]; then
      error "\t❌ $1 not found in path." >&2
      false
  else
      echo "\t✔ $1 found in path"
      true
  fi
}

pkg_manager() {
  managers="aptitude apt-get brew pacman yum pkg_add"
  for manager in ${managers}; do
    has "$manager" && echo "$manager" && exit
  done
}

install_pkgs() {
  info "Installing $1 using $(pkg_manager)"
  case $(pkg_manager) in
    brew) brew install $1 ;;
    apt-get) sudo apt-get install -qqy $1 ;;
    aptitude) sudo aptitude -y install $1 ;;
    pacman) pacman --sync --noconfirm --noprogressbar $1 ;;
    yum) yum -y install $1 ;;
    pkg_add) pkg_add -r $1 ;;
    *)
  esac
}

check() {
  has_and_notify "node"||
    (error "Tablero requires node.js, please install it and run this script again.";
     info "Instructions to install node.js on https://github.com/joyent/node/wiki/installing-node.js-via-package-manager";
     false) &&
    (has_and_notify "npm" || error "Could not find npm!")
}

download() {
  ([ -d $TARGET ] && info "$TARGET directory already exists.") ||
    (info "Cloning repository" &&
      has_and_notify "git" && git clone $REPO --branch $BRANCH --single-branch $TARGET) ||
    (info "Trying to download"
      has_and_notify "tar" &&
      has_and_notify "wget" &&
      mkdir $TARGET &&
      wget -qO- $ARCHIVE | tar --strip=1 -C $TARGET -zxf -) ||
    (error "Not able to download Tablero :("; false)
}

install() {
  info "Installing tablero dependencies"
  has_and_notify "make"
  has_and_notify "gcc"
  cd $TARGET && 
    (sudo npm install -g bower &&
      npm install --production) ||
    (error 'Something went wrong while installing tablero dependencies :(';
      false)
}

start() {
  info "Starting the application..."
  npm start
}

welcome
check &&
  download &&
  install &&
  start
