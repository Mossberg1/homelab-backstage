NAME        = bin/shell

SRC_DIR     = src
OBJ_DIR     = obj
INC_DIR     = includes

CC          = gcc
CFLAGS      = -Wall -Wextra -Werror -I$(INC_DIR)

SRCS        = $(wildcard $(SRC_DIR)/*.c)
OBJS        = $(SRCS:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)

all: $(NAME)

$(NAME): $(OBJS)
	@mkdir -p bin
	$(CC) $(CFLAGS) $(OBJS) -o $(NAME)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJ_DIR)

fclean: clean
	rm -rf bin

re: fclean all

.PHONY: all clean fclean re