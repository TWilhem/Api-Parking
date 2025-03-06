#!/bin/bash

convert_to_cron() {
    input="$1"
    unit="${input: -1}"
    value="${input::-1}"

    case "$unit" in
        "s") echo "* * * * * (sleep $value; your_command)" ;;
        "m") echo "*/$value * * * * your_command" ;;
        "h") echo "0 */$value * * * your_command" ;;
        "d") echo "0 0 */$value * * your_command" ;;
        *) echo "Format invalide. Utilisez un nombre suivi de s, m, h ou d (ex: 10m, 2h, 1d)" ;;
    esac
}

if [ -z "$1" ]; then
    echo "Usage: $0 <temps> (ex: 10m, 2h, 30s, 1d)"
    exit 1
fi

convert_to_cron "$1"