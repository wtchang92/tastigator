# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-09 06:17
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0005_response'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Response',
            new_name='Feedback',
        ),
    ]