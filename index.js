require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!panel') {

    const embed = new EmbedBuilder()
      .setTitle('Support Tickets')
      .setDescription('Press the button below to open a ticket')
      .setColor('Blue');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('Open Ticket')
          .setStyle(ButtonStyle.Success)
      );

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on('interactionCreate', async (interaction) => {

  if (!interaction.isButton()) return;

  if (interaction.customId === 'create_ticket') {

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    const paymentButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('paypal')
          .setLabel('PayPal')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('binance')
          .setLabel('Binance')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('cashapp')
          .setLabel('Cash App')
          .setStyle(ButtonStyle.Secondary)
      );

    await channel.send({
      content: `Welcome ${interaction.user}`,
      components: [paymentButtons]
    });

    await interaction.reply({
      content: `Ticket created: ${channel}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'paypal') {

    await interaction.reply({
      content: `Pay here: ${process.env.PAYPAL_LINK}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'binance') {

    await interaction.reply({
      content: `Pay here: ${process.env.BINANCE_LINK}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'cashapp') {

    await interaction.reply({
      content: `Send payment to ${process.env.CASHAPP_TAG} and upload proof.`,
      ephemeral: true
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log('Webhook server online');
});

client.login(process.env.TOKEN);